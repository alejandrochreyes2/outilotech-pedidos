using PagosAPI.Models;

namespace PagosAPI.Repositories
{
    public interface IPagoRepository
    {
        Task<IEnumerable<Pago>> GetAllAsync();
        Task CreateAsync(Pago pago);
    }

    public class PagoRepository : IPagoRepository
    {
        private static readonly List<Pago> _pagos = new();

        public Task<IEnumerable<Pago>> GetAllAsync() => Task.FromResult((IEnumerable<Pago>)_pagos);

        public Task CreateAsync(Pago pago)
        {
            pago.Id = _pagos.Count + 1;
            _pagos.Add(pago);
            return Task.CompletedTask;
        }
    }
}
