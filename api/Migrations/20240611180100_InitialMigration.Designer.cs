﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using api.Model;

#nullable disable

namespace api.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20240611180100_InitialMigration")]
    partial class InitialMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("api.Model.Entity.TimeFrame", b =>
                {
                    b.Property<int>("TimeFrameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TimeFrameId"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("text");

                    b.Property<DateTimeOffset?>("TimeFrameEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTimeOffset>("TimeFrameStart")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("TimeFrameId");

                    b.ToTable("TimeFrames");
                });
#pragma warning restore 612, 618
        }
    }
}
