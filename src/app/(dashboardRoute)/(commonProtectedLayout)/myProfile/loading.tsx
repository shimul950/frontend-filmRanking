import { FilmPageLoader } from "@/components/shared/FilmPageLoader";

export default function MyProfileLoading() {
  return (
    <FilmPageLoader
      text="Loading profile..."
      subtext="Retrieving your account details & activity"
    />
  );
}
