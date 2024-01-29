using Microsoft.AspNetCore.Mvc;
using yousefWeb.DAL;
using yousefWeb.Models.DTO;
using yousefWeb.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Text.Json;

namespace yousefWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly MyAppContext _context;

        public ItemsController(MyAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var items = await _context.Items.Include(item => item.Category).Include(item => item.Currency).ToListAsync();
                if (items.Count == 0)
                {
                    return NotFound("Data Not Found");
                }
                return Ok(items);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetItemById/{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            try
            {
                var item = await _context.Items
                    .Where(item => item.Id == id).Include(item => item.Category).Include(item => item.Currency)
                    .ToListAsync();
                if (item.Count == 0)
                {
                    return NotFound("Data Not Found");
                }
                return Ok(item);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetItemsByCategory/{categoryId}")]
        public async Task<IActionResult> GetItemsByCategory(int categoryId)
        {
            try
            {
                var items = await _context.Items
                    .Where(item => item.CategoryId== categoryId)
                    .ToListAsync();

                if (items.Count == 0)
                {
                    return NotFound($"No items found for category ID {categoryId}");
                }

                return Ok(items);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPost("AddItem")]
        public async Task<IActionResult> Post(Itemdto model)
        {
            try
            {
                var existingItem = await _context.Items
                    .FirstOrDefaultAsync(i =>
                        i.Name == model.Name &&
                        i.CategoryId== model.CatId &&
                        Math.Round(i.Price, 2) == Math.Round(model.Price, 2) && // Round existing item's price
                        i.CurrencyId == model.CurrencyId);

                if (existingItem != null)
                {
                    return Conflict("Item with the same properties already exists.");
                }

                var newItem = new Item
                {
                    Name = model.Name,
                    CategoryId = model.CatId,
                    Price = Math.Round(model.Price, 2),
                    SellingPrice = model.SellingPrice,
                    Image = model.Image,
                    IsActive = true,
                    CurrencyId = model.CurrencyId,
                    SellingCurrencyId = model.SellingCurrencyId,
                };
                await _context.Items.AddAsync(newItem);
                await _context.SaveChangesAsync();
                return Ok("Successfully added.");
            }
            catch (Exception e)
            {
                while (e.InnerException != null)
                {
                    e = e.InnerException;
                }
                return BadRequest(e.Message);
            }
        }


        [HttpPut("UpdateItem/{id}")]
        public async Task<IActionResult> UpdateItem(int id, Itemdto model)
        {
            try
            {
                var existingItem = await _context.Items.FirstOrDefaultAsync(item => item.Id == id);
                if (existingItem == null)
                {
                    return NotFound($"Item with ID {id} not found");
                }
                existingItem.Name = model.Name;
                existingItem.Price = model.Price;
                existingItem.SellingPrice = model.SellingPrice;
                existingItem.Image = model.Image;
                existingItem.IsActive = model.IsActive;
                existingItem.CurrencyId = model.CurrencyId;
                existingItem.SellingCurrencyId = model.SellingCurrencyId;



                _context.Items.Update(existingItem);
                await _context.SaveChangesAsync();
                return Ok("Item updated successfully");
            }
            catch (Exception e)
            {
                while (e.InnerException != null)
                {
                    e = e.InnerException;
                }
                return BadRequest(e.Message);
            }
        }

        [HttpPut("DeactivateItem/{id}")]
        public async Task<IActionResult> DeactivateItem(int id, Itemdto model)
        {
            try
            {
                var existingItem = await _context.Items.FirstOrDefaultAsync(item => item.Id == id);
                if (existingItem == null)
                {
                    return NotFound($"Item with ID {id} not found");
                }
                existingItem.Name = model.Name;
                existingItem.CategoryId= model.CatId;
                existingItem.Price = model.Price;
                existingItem.Image = model.Image;
                existingItem.IsActive = false;
                existingItem.CurrencyId = model.CurrencyId;
                _context.Items.Update(existingItem);
                await _context.SaveChangesAsync();
                return Ok("Item deactivated successfully");
            }
            catch (Exception e)
            {
                while (e.InnerException != null)
                {
                    e = e.InnerException;
                }
                return BadRequest(e.Message);
            }
        }
        [HttpPut("UpdatePrice")]
        public async Task<IActionResult> UpdateAllItem([FromBody] JsonElement[] data)
        {
            try
            {
                foreach (var element in data)
                {
                    if (!element.TryGetProperty("id", out var idProperty) || !element.TryGetProperty("price", out var priceProperty))
                    {
                        return BadRequest("Invalid data format. Each object in the list must have 'Id' and 'Price' properties.");
                    }
                    int itemId = idProperty.GetInt32();
                    double itemPrice = priceProperty.GetDouble();
                    var existingItem = await _context.Items.FirstOrDefaultAsync(item => item.Id == itemId);
                    if (existingItem == null)
                    {
                        return NotFound($"Item with ID {itemId} not found");
                    }
                    existingItem.Price = itemPrice;
                    _context.Items.Update(existingItem);
                    await _context.SaveChangesAsync();
                }

                return Ok("Items updated successfully");
            }
            catch (Exception e)
            {
                while (e.InnerException != null)
                {
                    e = e.InnerException;
                }
                return BadRequest(e.Message);
            }
        }
        [HttpDelete]
        public async Task<IActionResult> delete(int id)
        {
            try
            {
                var item = await _context.Items.FindAsync(id);
                if (item == null)
                {
                    return NotFound("Currency not found");
                }
                _context.Items.Remove(item);
                await _context.SaveChangesAsync();
                return Ok("item deleted");
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
