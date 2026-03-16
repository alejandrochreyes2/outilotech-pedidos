using PagosAPI.Models;

namespace PagosAPI.Repositories
{
    public interface IPagoRepository
    {
        Task<IEnumerable<Pago>> GetAllAsync();
        Task CreateAsync(Pago pago);
    }
}
