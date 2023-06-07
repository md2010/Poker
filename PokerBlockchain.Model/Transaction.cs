using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokerBlockchain.Model
{
    public class Transaction : ITransaction
    {
        public string Sender { get; set; }
         
        public string Reciver { get; set; }
         
        public decimal Value { get; set; }

        public Transaction(string sender, string reciver, decimal value)
        {
            Sender = sender;
            Reciver = reciver;
            Value = value;
        }

    }
}
