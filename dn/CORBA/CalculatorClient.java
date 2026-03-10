import org.omg.CORBA.*;
import org.omg.CosNaming.*;

public class CalculatorClient {
    public static void main(String[] args) {
        try {
            ORB orb = ORB.init(args, null);

            org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
            NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

            Calculator calcRef = CalculatorHelper.narrow(ncRef.resolve_str("Calculator"));

            int result = calcRef.add(10, 5);
            System.out.println("Addition Result: " + result);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}