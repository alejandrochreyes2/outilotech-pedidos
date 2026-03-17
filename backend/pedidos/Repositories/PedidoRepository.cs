using PedidosAPI.Models;

namespace PedidosAPI.Repositories
{
    public class PedidoRepository : IPedidoRepository
    {
        private static readonly List<Pedido> _pedidos = new();

        public Task<IEnumerable<Pedido>> GetAllAsync()
        {
            return Task.FromResult((IEnumerable<Pedido>)_pedidos);
        }

        public Task<Pedido?> GetByIdAsync(int id)
        {
            return Task.FromResult(_pedidos.FirstOrDefault(p => p.Id == id));
        }

        public Task CreateAsync(Pedido pedido)
        {
            pedido.Id = _pedidos.Count + 1;
            _pedidos.Add(pedido);
            return Task.CompletedTask;
        }
    }
}
