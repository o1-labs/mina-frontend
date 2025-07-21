{
  description = "Mina Frontend - Angular application development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js and npm
            nodejs_20
            nodePackages.npm
            
            # Angular CLI
            nodePackages."@angular/cli"
            
            # Development tools
            git
            rsync
            openssh
            
            # Testing tools
            cypress
            chromium
            
            # Docker for containerization
            docker
            docker-compose
            
            # Build tools
            python3
            gcc
            gnumake
            
            # WebAssembly tools (for snarkyjs)
            wabt
          ];

          shellHook = ''
            echo "🚀 Mina Frontend Development Environment"
            echo "Node.js version: $(node --version)"
            echo "npm version: $(npm --version)"
            echo "Angular CLI version: $(ng version --skip-confirmation 2>/dev/null | head -1 || echo 'Not installed globally')"
            echo ""
            echo "Available commands:"
            echo "  npm install          - Install dependencies"
            echo "  npm start            - Start development server"
            echo "  npm run build        - Build for production"
            echo "  npm test             - Run tests"
            echo "  npm run tests        - Run Cypress e2e tests"
            echo ""
            
            # Set environment variables
            export CYPRESS_CACHE_FOLDER="$PWD/.cypress-cache"
            export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
            export PUPPETEER_EXECUTABLE_PATH="${pkgs.chromium}/bin/chromium"
            
            # Create .cypress-cache directory if it doesn't exist
            mkdir -p .cypress-cache
          '';

          # Set environment variables for the shell
          NIX_SHELL_PRESERVE_PROMPT = 1;
        };

        # For CI/CD or production builds
        packages.default = pkgs.stdenv.mkDerivation rec {
          pname = "mina-frontend";
          version = "0.0.0";
          
          src = ./.;
          
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
          ];
          
          buildPhase = ''
            npm ci
            npm run build:prod
          '';
          
          installPhase = ''
            mkdir -p $out
            cp -r dist/* $out/
          '';
        };
      });
}