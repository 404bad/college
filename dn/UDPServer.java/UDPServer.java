import java.net.*;

public class UDPServer {

    public static void main(String[] args) throws Exception {

        DatagramSocket socket = new DatagramSocket(5000);

        byte[] receiveData = new byte[1024];
        byte[] sendData;

        System.out.println("UDP Server started. Waiting for client...");

        DatagramPacket receivePacket =
                new DatagramPacket(receiveData, receiveData.length);

        socket.receive(receivePacket);

        String message = new String(receivePacket.getData()).trim();

        System.out.println("Received from client: " + message);

        InetAddress clientAddress = receivePacket.getAddress();
        int clientPort = receivePacket.getPort();

        String response = "Hello Client. You said: " + message;

        sendData = response.getBytes();

        DatagramPacket sendPacket =
                new DatagramPacket(sendData, sendData.length, clientAddress, clientPort);

        socket.send(sendPacket);

        socket.close();
    }
}