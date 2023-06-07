using ADO.Net.Client.Core;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PokerBlockchain.Model;
using PokerBlockchain.Service;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace PokerBlockchain.WebAPI.Controllers
{
    [ApiController]
    public class BlockchainController : ControllerBase
    {
        public BlockchainService Service { get; set; }
        public BlockchainController()
        {
            this.Service = BlockchainService.Instance;
        }

        [HttpGet("/addresses")]
        public async Task<ActionResult<List<string>>> Get()
        {
            var addresses = Service.PlayerAddresses;
            return addresses;
        }

        [HttpGet("/blockchain")]
        public async Task<ActionResult<Blockchain>> GetBlockchain()
        {
            var blockchain = Service.Blockchain;
            return (Blockchain)blockchain;
        }

        // POST 
        [HttpPost("/save-transactions")]
        public async Task<ActionResult> Post([FromBody]JsonElement json)
        {
            var transactionsREST = JsonConvert.DeserializeObject<TransactionsModel>(json.GetRawText());
            if(transactionsREST != null)
            {
                List<ITransaction> transactions = Map(transactionsREST);
                var result = Service.CreateBlock(transactions);
                if(result)
                    return Ok();
            }
            
            return BadRequest();
        }

        private List<ITransaction> Map(TransactionsModel transactionsModel) 
        {
            List<ITransaction> transactions = new List<ITransaction>();
            var list = transactionsModel.Transactions;
            foreach (var item in list) 
            {
                transactions.Add(new Transaction(item.SenderAddress, item.ReciverAddress, item.Amount));
            }
            return transactions;
        }
        /*
        // PUT api/<BlockchainController>/5
        [HttpPut]
        public async Task<IActionResult> Put(int id, string value)
        {
            //return Request.CreateResponse(HttpStatusCode.OK);
        }

        // DELETE api/<BlockchainController>/5
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            return Request.CreateResponse(HttpStatusCode.OK);
        }*/
    }

    public class TransactionsModel
    {
        [JsonProperty("Transactions")]
        public List<TransactionInsertModel> Transactions { get; set; }
    }
    public class TransactionInsertModel
    {
        [JsonProperty("senderAddress")]
        public string SenderAddress { get; set; }

        [JsonProperty("reciverAddress")]
        public string ReciverAddress { get; set; }

        [JsonProperty("amount")]
        public int Amount { get; set; }
    }
}
