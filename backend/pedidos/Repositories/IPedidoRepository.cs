using PedidosAPI.Models;

namespace PedidosAPI.Repositories
{
    public interface IPedidoRepository
    {
        Task<IEnumerable<Pedido>> GetAllAsync();
        Task<Pedido?> GetByIdAsync(int id);
        Task CreateAsync(Pedido pedido);
    }
}
