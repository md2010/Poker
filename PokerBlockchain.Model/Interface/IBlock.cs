using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokerBlockchain.Model
{
    public interface IBlock
    {
        int Index { get; set; }

        DateTime Timestamp { get; set; }

        string PreviousHash { get; set; }

        string Hash { get; set; }

        int Difficulty { get; set; }
        
        List<ITransaction> Transactions { get; set; }
    }
}
