import { toast } from "sonner";
import { Button } from "../components/ui/button";

function App() {
  return (
    <>
      <Button
        onClick={() =>
          toast.success("Тест прошел успешно", { position: "top-right" })
        }
      >
        Тест
      </Button>
    </>
  );
}

export default App;
