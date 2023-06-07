using PokerBlockchain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokerBlockchain.Service
{
    public interface IBlockchainService
    {
        IBlockChain Blockchain { get; set; }
        List<string> PlayerAddresses { get; set; }
        void AddBlockToBlockchain(IBlock block);
        bool CreateBlock(List<ITransaction> transactions);
    }
}
