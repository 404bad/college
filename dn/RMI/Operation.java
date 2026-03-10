import java.rmi.Remote;
import java.rmi.RemoteException;

public interface Operation extends Remote {

    int multiply(int a, int b) throws RemoteException;

    int divide(int a, int b) throws RemoteException;

}