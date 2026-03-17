namespace UsuariosAPI.DTOs
{
    public record UserRegistrationDto(string Email, string Password, string FullName);
    public record UserLoginDto(string Email, string Password);
    public record UserResponseDto(string Email, string FullName, string Role, string Token);
}
