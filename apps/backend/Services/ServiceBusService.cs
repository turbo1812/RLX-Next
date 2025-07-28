using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace WMS.Backend.Services
{
    public class ServiceBusService
    {
        private readonly ServiceBusClient _client;
        private readonly string _defaultQueueOrTopic;

        public ServiceBusService(IConfiguration configuration)
        {
            var connectionString = configuration["ServiceBus:ConnectionString"] ?? configuration["AzureWebJobsServiceBus"];
            _defaultQueueOrTopic = configuration["ServiceBus:DefaultQueueOrTopic"] ?? "wms-events";
            _client = new ServiceBusClient(connectionString);
        }

        public async Task SendMessageAsync(string messageBody, string? queueOrTopic = null)
        {
            var sender = _client.CreateSender(queueOrTopic ?? _defaultQueueOrTopic);
            var message = new ServiceBusMessage(messageBody);
            await sender.SendMessageAsync(message);
        }
    }
} 