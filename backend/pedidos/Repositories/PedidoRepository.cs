using PedidosAPI.Models;

namespace PedidosAPI.Repositories
{
    public class PedidoRepository : IPedidoRepository
    {
        private static readonly List<Pedido> _pedidos = new();

        public async Task<IEnumerable<Pedido>> GetAllAsync()
        {
            return await Task.FromResult(_pedidos);
        }

        public async Task<Pedido?> GetByIdAsync(int id)
        {
            return await Task.FromResult(_pedidos.FirstOrDefault(p => p.Id == id));
        }

        public async Task CreateAsync(Pedido pedido)
        {
            pedido.Id = _pedidos.Count + 1;
            _pedidos.Add(pedido);
            await Task.CompletedTask;
        }
    }
}
