using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokerBlockchain.Model
{
    public interface ITransaction
    {
        string Sender { get; set; }

        string Reciver { get; set; }

        decimal Value { get; set; }

    }
}
