using AutoMapper;
using UsuariosAPI.Models;
using UsuariosAPI.DTOs;

namespace UsuariosAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ApplicationUser, UserResponseDto>();
            CreateMap<UserRegistrationDto, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
        }
    }
}
