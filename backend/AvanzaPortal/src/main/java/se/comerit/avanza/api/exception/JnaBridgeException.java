package se.comerit.avanza.api.exception;

public class JnaBridgeException extends Exception {

    public JnaBridgeException(String message) {
        super(message);
    }

    public static void evaluateBridgeState(boolean dataSent, boolean valuesReturned, boolean memoryCleaned) throws JnaBridgeException {
        StringBuilder errorReport = new StringBuilder();

        if (!dataSent) {
            errorReport.append("Transmission failure: Data array missing or rejected. ");
        }
        if (!valuesReturned) {
            errorReport.append("Return failure: C++ pointer returned null. ");
        }
        if (!memoryCleaned) {
            errorReport.append("Memory leak detected: C++ deallocation function bypassed or failed. ");
        }
        if (!errorReport.isEmpty()) {
            throw new JnaBridgeException("JNA Bridge Validation Error -> " + errorReport.toString().trim());
        }
    }
}
