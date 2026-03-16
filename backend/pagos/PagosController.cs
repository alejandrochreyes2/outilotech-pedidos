using Microsoft.AspNetCore.Mvc;
using Pagos.Models;
using Pagos.Services;

namespace Pagos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagosController : ControllerBase
    {
        private readonly PagosService _pagosService;

        public PagosController(PagosService pagosService)
        {
            _pagosService = pagosService;
        }

        [HttpGet]
        public async Task<List<Pago>> Get() => await _pagosService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Pago>> Get(string id)
        {
            var pago = await _pagosService.GetAsync(id);
            return pago is null ? NotFound() : pago;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Pago nuevoPago)
        {
            await _pagosService.CreateAsync(nuevoPago);
            return CreatedAtAction(nameof(Get), new { id = nuevoPago.Id }, nuevoPago);
        }
    }
}