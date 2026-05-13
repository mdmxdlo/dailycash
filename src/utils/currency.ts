export type CurrencyType = "FCFA" | "GNF" | "EUR" | "USD";

export const formatCurrency = (amount: number, currency: CurrencyType = "FCFA"): string => {
  const formattedAmount = amount.toLocaleString("fr-FR");

  switch (currency) {
    case "FCFA":
      return `${formattedAmount} FCFA`;
    case "GNF":
      return `${formattedAmount} GNF`;
    case "EUR":
      return `${formattedAmount} €`;
    case "USD":
      return `$${formattedAmount}`;
    default:
      return `${formattedAmount} FCFA`;
  }
};
