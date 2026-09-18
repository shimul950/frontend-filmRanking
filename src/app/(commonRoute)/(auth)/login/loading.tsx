import { FilmPageLoader } from "@/components/shared/FilmPageLoader";

export default function LoginLoading() {
  return (
    <FilmPageLoader
      text="Loading secure login..."
      subtext="Access your film profile, favorites & watchlists"
    />
  );
}
