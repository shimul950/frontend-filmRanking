import { FilmPageLoader } from "@/components/shared/FilmPageLoader";

export default function ChangePasswordLoading() {
  return (
    <FilmPageLoader
      text="Loading security settings..."
      subtext="Preparing password management"
    />
  );
}
