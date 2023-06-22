using PokerBlockchain.Model;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Transactions;

namespace PokerBlockchain.Service
{
    public sealed class BlockchainService : IBlockchainService
    {
        public IBlockChain Blockchain { get; set; }
        public List<string> PlayerAddresses { get; set; } //at [0] dealer's address

        private static BlockchainService instance = null;
        public static BlockchainService Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new BlockchainService();
                }
                return instance;
            }
        }

        private BlockchainService() 
        {
            Blockchain = new Blockchain();
            Blockchain.Blocks = new List<IBlock>();
            this.PlayerAddresses = new List<string>();
            this.GeneratePublicKey();
            this.CreateGenesisBlock();
        }

        private void GeneratePublicKey()
        {           
            for(int i = 0; i < 5; i++)
            {
                RSA rsa = new RSACryptoServiceProvider(1024);
                string publicOnlyKeyXML = rsa.ToXmlString(false);
                RSAParameters RSAKeyInfo = rsa.ExportParameters(false);
                this.PlayerAddresses.Add(Convert.ToBase64String(RSAKeyInfo.Modulus));
            }           
        }

        private void CreateGenesisBlock()
        {
            List<ITransaction> transactions = new List<ITransaction>();
            for(int i = 1; i <= 4; i++)
            {
                transactions.Add(new Model.Transaction(this.PlayerAddresses[0], this.PlayerAddresses[i], 30));
            }

            IBlock block = new Block(0, DateTime.Now, "0", 1, transactions);
            block.Hash = "0";
            this.Blockchain.Blocks.Add(block);
        }
        public bool CreateBlock(List<ITransaction> transactions)
        {
            IBlock block = new Block(this.GetCount(), DateTime.Now, this.GetPreviousBlock().Hash, 1, transactions);
            block.Hash = this.MineBlock(block);
            this.AddBlockToBlockchain(block);
            return true;
        }

        private string MineBlock(IBlock block)
        {
            var previousHash = this.GetPreviousBlock().Hash;
            StringBuilder builder = new StringBuilder();
            builder.Append(previousHash + block.Timestamp);
            foreach (var t in block.Transactions)
            {
                builder.Append(this.ConvertToString(t));
            }
            string rawData = builder.ToString();

            string hash = "";
            int nonce = 0;
            string hashValidationTemplate = new String('0', block.Difficulty);

            do
            {
                hash = this.Hash(nonce + rawData);
                nonce++;
            }
            while (hash.Substring(0, block.Difficulty) != hashValidationTemplate);

            return hash;
        }
        private string ConvertToString(ITransaction t)
        {
            return t.Sender + t.Reciver + t.Value;
        }
        private string Hash(string data)
        {          
            using (SHA256 sha256 = SHA256.Create())
            {                
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data));
                return Convert.ToBase64String(bytes);
            }
        }
        
        private int GetCount()
        {
            return this.Blockchain.Blocks.Count();
        }

        private IBlock GetPreviousBlock()
        {
            return this.Blockchain.Blocks[this.GetCount() - 1];
        }

        public void AddBlockToBlockchain(IBlock block)
        {
            this.Blockchain.Blocks.Add(block);   
        }
    }
}