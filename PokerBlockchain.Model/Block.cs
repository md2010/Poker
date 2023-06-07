namespace PokerBlockchain.Model
{
    public class Block : IBlock
    {
        public int Index { get; set; }
         
        public DateTime Timestamp { get; set; }
         
        public string PreviousHash { get; set; }

        public string Hash { get; set; }

        public int Difficulty { get; set; }

        public List<ITransaction> Transactions { get; set; }

        public Block(int index, DateTime timestamp, string previousHash, int difficulty, List<ITransaction> transactions)
        {
            Index = index;
            Timestamp = timestamp;
            PreviousHash = previousHash;
            Difficulty = difficulty;
            Transactions = transactions;
        }
    }
}