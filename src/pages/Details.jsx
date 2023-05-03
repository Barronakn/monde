import { QueryClient, QueryClientProvider } from "react-query";
import DetailsList from "../components/DetailsList";

const DetailsPage = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <DetailsList />
    </QueryClientProvider>
  );
};

export default DetailsPage;
