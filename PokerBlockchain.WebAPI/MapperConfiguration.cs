using AutoMapper;
using PokerBlockchain.Model;
using PokerBlockchain.WebAPI.Controllers;

namespace PokerBlockchain.WebAPI
{
    public class MapperConfiguration : Profile
    {
        public MapperConfiguration()
        {
            CreateMap<TransactionInsertModel,
                ITransaction>()
                .ForMember(dest => dest.Sender, opt => opt.MapFrom(src => src.SenderAddress))
                .ForMember(dest => dest.Reciver, opt => opt.MapFrom(src => src.ReciverAddress))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Amount));

            CreateMap<TransactionsModel, TransactionInsertModel>();

        }
    }
}
