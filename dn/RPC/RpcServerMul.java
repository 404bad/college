import java.io.*;
import java.net.*;

public class RpcServerMul {

    public static void main(String[] args) {

        try {

            ServerSocket serverSocket = new ServerSocket(6000);
            System.out.println("RPC Server running...");

            while(true) {

                Socket socket = serverSocket.accept();

                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream()));

                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

                String request = in.readLine();   // multiply 4 5

                String[] parts = request.split(" ");

                if(parts[0].equals("multiply") && parts.length == 3) {

                    int a = Integer.parseInt(parts[1]);
                    int b = Integer.parseInt(parts[2]);

                    int result = a * b;

                    out.println("Multiplication Result: " + result);

                } else {

                    out.println("Invalid request");

                }

                socket.close();
            }

        } catch(Exception e) {

            e.printStackTrace();

        }
    }
}