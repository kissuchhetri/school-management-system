#!/bin/bash

# Test Runner Script for School Management System
# Usage: ./run-tests.sh [option]

echo "🧪 School Management System - Test Runner"
echo "=========================================="

# Function to run tests with coverage
run_with_coverage() {
    echo "📊 Running tests with coverage report..."
    npm run test:coverage
}

# Function to run tests in watch mode
run_watch() {
    echo "👀 Running tests in watch mode..."
    npm run test:watch
}

# Function to run specific test suite
run_specific() {
    local test_suite=$1
    echo "🎯 Running $test_suite tests..."
    npm run test:$test_suite
}

# Function to run all tests
run_all() {
    echo "🚀 Running all tests..."
    npm test
}

# Function to show help
show_help() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  all         - Run all tests"
    echo "  coverage    - Run tests with coverage report"
    echo "  watch       - Run tests in watch mode"
    echo "  auth        - Run authentication tests only"
    echo "  assignment  - Run assignment tests only"
    echo "  student     - Run student tests only"
    echo "  integration - Run integration tests only"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 all"
    echo "  $0 coverage"
    echo "  $0 auth"
}

# Check if argument is provided
if [ $# -eq 0 ]; then
    echo "❌ No option provided"
    show_help
    exit 1
fi

# Process command line argument
case $1 in
    "all")
        run_all
        ;;
    "coverage")
        run_with_coverage
        ;;
    "watch")
        run_watch
        ;;
    "auth"|"assignment"|"student"|"integration")
        run_specific $1
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "❌ Invalid option: $1"
        show_help
        exit 1
        ;;
esac

echo ""
echo "✅ Test run completed!" 