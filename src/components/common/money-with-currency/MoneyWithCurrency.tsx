import { cn, currencyFormatter } from "@/lib/utils";

interface MoneyWithCurrencyProps {
  amount: number | null | undefined;
}

const MoneyWithCurrency = ({ amount }: MoneyWithCurrencyProps) => {
  return (
    <span
      className={cn({
        "text-destructive": amount != null && amount < 0,
        "bg-red-100 text-green-800 px-4 rounded-full ": amount == null,
      })}
    >
      {currencyFormatter(amount, "USD")}
    </span>
  );
};

export default MoneyWithCurrency;
