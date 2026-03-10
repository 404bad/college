import java.net.*;

public class UDPClient {

    public static void main(String[] args) throws Exception {

        DatagramSocket socket = new DatagramSocket();

        InetAddress serverAddress = InetAddress.getByName("localhost");

        byte[] sendData = "Hello Server from UDP Client".getBytes();
        byte[] receiveData = new byte[1024];

        DatagramPacket sendPacket =
                new DatagramPacket(sendData, sendData.length, serverAddress, 5000);

        socket.send(sendPacket);

        DatagramPacket receivePacket =
                new DatagramPacket(receiveData, receiveData.length);

        socket.receive(receivePacket);

        String response = new String(receivePacket.getData()).trim();

        System.out.println("Server replied: " + response);

        socket.close();
    }
}