import java.io.*;
import java.net.*;
import java.util.Scanner;

public class RpcClientMul {

    public static void main(String[] args) {

        try {

            Socket socket = new Socket("localhost", 6000);

            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(socket.getInputStream()));

            Scanner sc = new Scanner(System.in);

            System.out.print("Enter first number: ");
            int a = sc.nextInt();

            System.out.print("Enter second number: ");
            int b = sc.nextInt();

            out.println("multiply " + a + " " + b);

            String response = in.readLine();

            System.out.println(response);

            socket.close();

        } catch(Exception e) {

            e.printStackTrace();

        }
    }
}