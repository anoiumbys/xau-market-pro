<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use OpenApi\Generator;
use OpenApi\Annotations\OpenApi;

class GenerateOpenApi extends Command
{
    protected $signature = 'openapi:generate 
                            {--output= : Output file path (default: contracts/openapi.yaml)}
                            {--validate : Validate the generated spec}';

    protected $description = 'Generate OpenAPI specification from PHP attributes';

    public function handle(): int
    {
        $outputPath = $this->option('output') ?? base_path('../contracts/openapi.yaml');
        $validate = $this->option('validate');

        $this->info('Generating OpenAPI specification...');

        try {
            // Scan the application for OpenAPI attributes
            $openapi = Generator::scan([
                app_path('Http/Controllers/Api'),
                app_path('Http/Controllers/Auth'),
                app_path('Models'),
            ]);

            // Add base configuration from openapi.php
            $baseConfig = include base_path('openapi.php');
            $this->mergeBaseConfig($openapi, $baseConfig);

            // Generate YAML
            $yaml = $openapi->toYaml();

            // Ensure output directory exists
            $outputDir = dirname($outputPath);
            if (!is_dir($outputDir)) {
                mkdir($outputDir, 0755, true);
            }

            file_put_contents($outputPath, $yaml);

            $this->info("OpenAPI spec written to: {$outputPath}");

            if ($validate) {
                $this->validateSpec($outputPath);
            }

            return Command::SUCCESS;

        } catch (\Throwable $e) {
            $this->error('Failed to generate OpenAPI spec: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
            return Command::FAILURE;
        }
    }

    private function mergeBaseConfig(\OpenApi\Annotations\OpenApi $openapi, array $baseConfig): void
    {
        // Merge info
        if (isset($baseConfig['info'])) {
            $openapi->info = new \OpenApi\Annotations\Info($baseConfig['info']);
        }

        // Merge servers
        if (isset($baseConfig['servers'])) {
            $openapi->servers = array_map(
                fn($server) => new \OpenApi\Annotations\Server($server),
                $baseConfig['servers']
            );
        }

        // Merge components
        if (isset($baseConfig['components'])) {
            $openapi->components = new \OpenApi\Annotations\Components($baseConfig['components']);
        }

        // Merge security
        if (isset($baseConfig['security'])) {
            $openapi->security = $baseConfig['security'];
        }

        // Merge tags
        if (isset($baseConfig['tags'])) {
            $openapi->tags = array_map(
                fn($tag) => new \OpenApi\Annotations\Tag($tag),
                $baseConfig['tags']
            );
        }
    }

    private function validateSpec(string $path): void
    {
        $this->info('Validating OpenAPI specification...');
        
        // Use openapi-validator if available
        $validatorPath = base_path('../contracts/node_modules/.bin/openapi-validator');
        
        if (file_exists($validatorPath)) {
            $output = shell_exec("{$validatorPath} {$path} 2>&1");
            if ($output) {
                $this->line($output);
            }
            $this->info('Validation complete.');
        } else {
            $this->warn('openapi-validator not found in contracts/node_modules. Skipping validation.');
            $this->info('Run "npm install" in contracts/ to enable validation.');
        }
    }
}