using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Pagos.Models;

namespace Pagos.Services
{
    public class PagosService
    {
        private readonly IMongoCollection<Pago> _pagosCollection;

        public PagosService(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("MongoDb");
            var mongoClient = new MongoClient(connectionString);
            var mongoDatabase = mongoClient.GetDatabase("PagosDB");

            _pagosCollection = mongoDatabase.GetCollection<Pago>("Pagos");
        }

        public async Task<List<Pago>> GetAsync() =>
            await _pagosCollection.Find(_ => true).ToListAsync();

        public async Task<Pago?> GetAsync(string id) =>
            await _pagosCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Pago nuevoPago) =>
            await _pagosCollection.InsertOneAsync(nuevoPago);

        public async Task UpdateAsync(string id, Pago pagoActualizado) =>
            await _pagosCollection.ReplaceOneAsync(x => x.Id == id, pagoActualizado);
    }
}