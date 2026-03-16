using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Pagos.Models
{
    public class Pago
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("pedidoId")]
        public string? PedidoId { get; set; }

        [BsonElement("monto")]
        public decimal Monto { get; set; }

        [BsonElement("estado")]
        public string? Estado { get; set; } = "Pendiente";

        [BsonElement("fechaCreacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}