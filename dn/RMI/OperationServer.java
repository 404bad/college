import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class OperationServer {

    public static void main(String[] args) {

        try {

            LocateRegistry.createRegistry(1099);

            Operation op = new OperationImpl();

            Naming.rebind("OperationService", op);

            System.out.println("Server is running...");

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}