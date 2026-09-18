import { FilmPageLoader } from "@/components/shared/FilmPageLoader";

export default function PaymentSuccessLoading() {
  return (
    <FilmPageLoader
      text="Verifying payment..."
      subtext="Confirming your transaction & activating membership"
    />
  );
}
