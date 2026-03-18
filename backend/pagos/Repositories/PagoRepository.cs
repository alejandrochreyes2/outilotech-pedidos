using Microsoft.EntityFrameworkCore;
using PagosAPI.Data;
using PagosAPI.Models;

namespace PagosAPI.Repositories
{
    public class PagoRepository : IPagoRepository
    {
        private readonly PagosDbContext _context;

        public PagoRepository(PagosDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Pago>> GetAllAsync()
        {
            return await _context.Pagos.ToListAsync();
        }

        public async Task CreateAsync(Pago pago)
        {
            _context.Pagos.Add(pago);
            await _context.SaveChangesAsync();
        }
    }
}
