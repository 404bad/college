import calculator.CalculatorService;
import calculator.CalculatorServiceService;

public class CalculatorClient {

    public static void main(String[] args) {

        CalculatorServiceService service = new CalculatorServiceService();
        CalculatorService calculator = service.getCalculatorServicePort();

        int a = 10;
        int b = 5;

        System.out.println("Addition: " + calculator.add(a, b));
        System.out.println("Subtraction: " + calculator.subtract(a, b));
        System.out.println("Multiplication: " + calculator.multiply(a, b));
        System.out.println("Division: " + calculator.divide(a, b));
    }
}
