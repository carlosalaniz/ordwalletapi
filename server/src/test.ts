import { OrdBridge } from "./ord/ordBridge"

(async () => {
    const newWallet = await OrdBridge.create("new_wallet_6")
    const bridge = new OrdBridge({ id: "new_wallet_6" });
    const balance = await bridge.balance();
    const inscriptions = await bridge.inscriptions();
    const transactions = await bridge.transactions();
    const receive = await bridge.receive();
    const inscribe = await bridge.inscribe(
        "/home/user/.inscription_files/02c9c3ad-0774-4b7a-acfd-bcb534612c8e.jpg",
        4, { dryRun: true }
    );
    const send = await bridge.send(
        { address: "bcddzsd1pk50zdpcs8yvy22fu7ya92gepcht9jpl95cq9xx9geqwy5y8z4mcse9z363" },
        "81171dd249c959afec82221ad7467cf52b37f76a1d78e0ed2999528937b9340bi0",
        4
    )
    console.log(transactions, inscriptions, receive, balance, inscribe, send);
})()