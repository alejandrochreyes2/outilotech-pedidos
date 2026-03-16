using PagosAPI.Models;

namespace PagosAPI.Repositories
{
    public class PagoRepository : IPagoRepository
    {
        private static readonly List<Pago> _pagos = new();

        public async Task<IEnumerable<Pago>> GetAllAsync()
        {
            return await Task.FromResult(_pagos);
        }

        public async Task CreateAsync(Pago pago)
        {
            pago.Id = _pagos.Count + 1;
            _pagos.Add(pago);
            await Task.CompletedTask;
        }
    }
}
