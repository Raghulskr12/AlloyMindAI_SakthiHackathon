// pages/api/opcClient.js (or any server-side file)
import { OPCUAClient, AttributeIds, TimestampsToReturn, ClientSubscription, ClientMonitoredItem } from "node-opcua";

export default async function handler(req, res) {
  // OPC UA server endpoint (replace with your real endpoint)
  const endpointUrl = "opc.tcp://localhost:4840";

  // Create client instance
  const client = OPCUAClient.create({ endpoint_must_exist: false });
  
  try {
    // Connect to the OPC UA server
    await client.connect(endpointUrl);
    console.log("Connected to OPC UA Server");

    // Create a session
    const session = await client.createSession();
    console.log("Session created");

    // Example: Read a node value (replace with your node id)
    const nodeId = "ns=1;s=Temperature"; // example node
    const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
    console.log(`Value for node ${nodeId}:`, dataValue.value.value);

    // Set up a subscription to monitor changes
    const subscription = ClientSubscription.create(session, {
      requestedPublishingInterval: 1000,
      requestedLifetimeCount: 6000,
      requestedMaxKeepAliveCount: 10,
      maxNotificationsPerPublish: 10,
      publishingEnabled: true,
      priority: 10
    });

    // Monitor the same node for changes
    const monitoredItem = ClientMonitoredItem.create(
      subscription,
      { nodeId, attributeId: AttributeIds.Value },
      { samplingInterval: 100, discardOldest: true, queueSize: 10 },
      TimestampsToReturn.Both
    );

    monitoredItem.on("changed", (dataValue) => {
      console.log(`Node value changed:`, dataValue.value.value);
      // You can push this data via WebSocket or update your database here
    });

    // Respond with the initial read value
    res.status(200).json({ value: dataValue.value.value });

    // Note: In production, you'd keep subscription alive and handle disconnects & errors

  } catch (error) {
    console.error("OPC UA error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // For demo: close session and disconnect immediately (in real apps, manage connection lifecycle)
    // await session.close();
    // await client.disconnect();
  }
}
