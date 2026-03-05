FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:3002
EXPOSE 3002
 



FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PedidosAPI.csproj", "."]
RUN dotnet restore "PedidosAPI.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "PedidosAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PedidosAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PedidosAPI.dll"]
