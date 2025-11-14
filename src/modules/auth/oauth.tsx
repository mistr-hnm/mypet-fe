import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Route } from "../../routes/_auth/oauth";

export function OAuth() {

  const navigate = useNavigate()
  const routes = Route.useSearch();

  const encodedData = routes.data; 

  if (encodedData && typeof encodedData == 'object') {
    localStorage.setItem("auth", JSON.stringify(encodedData));
    setTimeout(() => {
      navigate({ to: '/' });
    });
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Navigating</CardTitle>
          <CardDescription>Please wait for a while</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

}
