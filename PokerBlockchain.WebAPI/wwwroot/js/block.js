$(document).ready(function () {
    let blocks = [];
    getBlocks();

    async function getBlocks() {
        const response = await fetch("/blockchain");
        let blockchain = await response.json();
        blocks = blockchain.blocks;
        displayBlocks();
    }
  /*let blocks = [
    {
      index: 1,
      timestamp: "2023-06-04 12:34:56",
      hash: "a1b2c3d4e5",
      prevHash: "09876xwvut",
      transactions: [
        { sender: "addr", receiver: "recv", amount: 0.5 },
        { sender: "addr", receiver: "recv", amount: 1.2 },
      ],
    },
    {
        index: 1,
        timestamp: "2023-06-04 12:34:56",
        hash: "a1b2c3d4e5",
        prevHash: "09876xwvut",
        transactions: [
          { sender: "addr", receiver: "recv", amount: 0.5 },
          { sender: "addr", receiver: "recv", amount: 1.2 },
        ],
      },
    {
      index: 2,
      timestamp: "2023-06-05 09:12:34",
      hash: "f5e4d3c2b1",
      prevHash: "76543qwert",
      transactions: [
        { sender: "addr", receiver: "recv", amount: 0.8 },
        { sender: "addr", receiver: "recv", amount: 2.3 },
        { sender: "addr", receiver: "recv", amount: 1.5 },
      ],
    }
  ];*/

    function displayBlocks() {

        let blockContainer = $(".block-container");

        blocks.forEach(function (block) {
            let blockDiv = $("<div>").addClass("block");

            $("<h2>").text("Block" + block.index).appendTo(blockDiv);

            $("<label>").text("Index: ").appendTo(blockDiv);
            $("<span>").text(block.index).appendTo(blockDiv);
            blockDiv.append($("<br>"));

            $("<label>").text("Timestamp: ").appendTo(blockDiv);
            $("<span>").text(block.timestamp).appendTo(blockDiv);
            blockDiv.append($("<br>"));

            $("<label>").text("Hash: ").appendTo(blockDiv);
            $("<span>").text(block.hash).appendTo(blockDiv);
            blockDiv.append($("<br>"));

            $("<label>").text("Previous Hash: ").appendTo(blockDiv);
            $("<span>").text(block.previousHash).appendTo(blockDiv);
            blockDiv.append($("<br>"));

            let transactionsDiv = $("<div>").addClass("transactions");
            $("<label>").text("Transactions:").appendTo(transactionsDiv);

            let details = $("<details>");
            let summary = $("<summary>").text("See transactions");

            let transactionList = $("<ul>").addClass("transaction-list");
            block.transactions.forEach(function (transaction) {
                let transactionItem = $("<br><li>").text(
                    `Sender: ${transaction.sender}, Receiver: ${transaction.reciver}, Amount: ${transaction.value}`
                );
                transactionList.append(transactionItem);
            });

            details.append(summary, transactionList);
            transactionsDiv.append(details);

            blockDiv.append(transactionsDiv);
            blockContainer.append(blockDiv);
        });
    }
 });

