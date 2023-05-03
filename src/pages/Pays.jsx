import { QueryClient, QueryClientProvider } from "react-query";
import Query from "../components/Query";

const queryClient = new QueryClient();

const Pays = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Query />
    </QueryClientProvider>
  );
};

export default Pays;
