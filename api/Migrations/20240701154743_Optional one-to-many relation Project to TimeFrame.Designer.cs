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
    [Migration("20240701154743_Optional one-to-many relation Project to TimeFrame")]
    partial class OptionalonetomanyrelationProjecttoTimeFrame
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("api.Model.Entity.Project", b =>
                {
                    b.Property<int>("ProjectId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ProjectId"));

                    b.Property<string>("ProjectDescription")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("ProjectName")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("ProjectId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("api.Model.Entity.TimeFrame", b =>
                {
                    b.Property<int>("TimeFrameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TimeFrameId"));

                    b.Property<string>("Description")
                        .HasMaxLength(256)
                        .HasColumnType("text");

                    b.Property<int?>("ProjectId")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("TimeFrameEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("TimeFrameStart")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("TimeFrameId");

                    b.HasIndex("ProjectId");

                    b.ToTable("TimeFrames");
                });

            modelBuilder.Entity("api.Model.Entity.TimeFrame", b =>
                {
                    b.HasOne("api.Model.Entity.Project", "Project")
                        .WithMany("TimeFrames")
                        .HasForeignKey("ProjectId");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("api.Model.Entity.Project", b =>
                {
                    b.Navigation("TimeFrames");
                });
#pragma warning restore 612, 618
        }
    }
}