/**
 * Solana Payment Integration
 * Handles SPL token payments using the Solana blockchain
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export interface SolanaConfig {
  rpcUrl: string;
  merchantWallet: string;
  splTokens: {
    [symbol: string]: {
      mint: string;
      decimals: number;
    };
  };
}

export interface SolanaPayment {
  id: string;
  amount: number;
  token: string;
  recipient: string;
  transactionId?: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: Date;
  confirmedAt?: Date;
}

export class SolanaPaymentService {
  private config: SolanaConfig;
  private connection: Connection;

  constructor(config: SolanaConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcUrl, "confirmed");
  }

  /**
   * Generate payment address for SOL or SPL tokens
   */
  async generatePaymentAddress(
    amount: number,
    token: string = "SOL",
    orderId: string
  ): Promise<{
    address: string;
    amount: number;
    qrCode: string;
    paymentId: string;
  }> {
    try {
      const paymentId = `sol_${orderId}_${Date.now()}`;

      // For SOL payments, use the merchant wallet directly
      if (token === "SOL") {
        return {
          address: this.config.merchantWallet,
          amount: amount / 100, // Convert cents to SOL
          qrCode: this.generateQRCode(
            this.config.merchantWallet,
            amount / 100,
            "SOL"
          ),
          paymentId,
        };
      }

      // For SPL tokens, use associated token account
      const tokenInfo = this.config.splTokens[token];
      if (!tokenInfo) {
        throw new Error(`Unsupported token: ${token}`);
      }

      // In a real implementation, you'd create an associated token account
      // For now, return the merchant wallet
      const adjustedAmount = amount / Math.pow(10, tokenInfo.decimals);

      return {
        address: this.config.merchantWallet,
        amount: adjustedAmount,
        qrCode: this.generateQRCode(
          this.config.merchantWallet,
          adjustedAmount,
          token
        ),
        paymentId,
      };
    } catch (error) {
      console.error("Solana generate payment address error:", error);
      throw new Error("Failed to generate payment address");
    }
  }

  /**
   * Check if a transaction has been confirmed
   */
  async checkTransaction(signature: string): Promise<{
    confirmed: boolean;
    confirmations?: number;
    slot?: number;
  }> {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        commitment: "confirmed",
      });

      if (!transaction) {
        return { confirmed: false };
      }

      const slot = transaction.slot;
      const currentSlot = await this.connection.getSlot();
      const confirmations = currentSlot - slot;

      return {
        confirmed: true,
        confirmations,
        slot,
      };
    } catch (error) {
      console.error("Solana check transaction error:", error);
      return { confirmed: false };
    }
  }

  /**
   * Verify payment by checking transaction details
   */
  async verifyPayment(
    signature: string,
    expectedAmount: number,
    expectedToken: string = "SOL"
  ): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        commitment: "confirmed",
      });

      if (!transaction) {
        return false;
      }

      // Check if transaction is to the correct recipient
      const recipient = new PublicKey(this.config.merchantWallet);
      const transactionRecipient =
        transaction.transaction.message.accountKeys[1];

      if (!recipient.equals(transactionRecipient)) {
        return false;
      }

      // Check amount (simplified - in production you'd parse the transaction properly)
      if (expectedToken === "SOL") {
        const lamports =
          transaction.meta?.postBalances[1]! -
          transaction.meta?.preBalances[1]!;
        const solAmount = lamports / LAMPORTS_PER_SOL;
        return Math.abs(solAmount - expectedAmount / 100) < 0.001; // Allow small difference
      }

      // For SPL tokens, you'd check the token transfer instruction
      // This is simplified for the example
      return true;
    } catch (error) {
      console.error("Solana verify payment error:", error);
      return false;
    }
  }

  /**
   * Get supported tokens
   */
  getSupportedTokens(): string[] {
    return ["SOL", ...Object.keys(this.config.splTokens)];
  }

  /**
   * Generate QR code data (simplified)
   */
  private generateQRCode(
    address: string,
    amount: number,
    token: string
  ): string {
    // In a real implementation, you'd use a QR code library
    // For now, return a simple payment URI
    if (token === "SOL") {
      return `solana:${address}?amount=${amount}`;
    }
    return `solana:${address}?amount=${amount}&spl-token=${token}`;
  }

  /**
   * Get current SOL balance
   */
  async getBalance(): Promise<number> {
    try {
      const publicKey = new PublicKey(this.config.merchantWallet);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error("Solana get balance error:", error);
      return 0;
    }
  }

  /**
   * Validate configuration
   */
  async validateConfig(): Promise<boolean> {
    try {
      await this.getBalance();
      return true;
    } catch (error) {
      console.error("Solana config validation error:", error);
      return false;
    }
  }
}

// Factory function to create Solana payment service
export function createSolanaPaymentService(
  config: SolanaConfig
): SolanaPaymentService {
  return new SolanaPaymentService(config);
}

// Default configuration (to be overridden with environment variables)
export const defaultSolanaConfig: SolanaConfig = {
  rpcUrl:
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    "https://api.mainnet-beta.solana.com",
  merchantWallet: process.env.SOLANA_MERCHANT_WALLET || "",
  splTokens: {
    USDC: {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
    },
    // Add more SPL tokens as needed
  },
};
