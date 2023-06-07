using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokerBlockchain.Model
{
    public class Blockchain : IBlockChain
    {
        public List<IBlock> Blocks { get; set; }

    }
}
