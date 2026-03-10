import java.rmi.Naming;

public class OperationClient {

    public static void main(String[] args) {

        try {

            Operation op = (Operation)
                    Naming.lookup("rmi://localhost/OperationService");

            System.out.println("Multiplication (4 * 5): " + op.multiply(4,5));

            System.out.println("Division (20 / 4): " + op.divide(20,4));

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}